import { useState, useRef, useEffect } from "react";
import { validateRefName } from "../validators";
import {
  useStringFormEntry,
  FormEntry,
  useDialogForm
} from "../components/Form";
import { del, set, valuesAsArray } from "../helpers/immutable-map";
import uuid from "uuid/v4";
import * as T from "../types";
import { layerTreeToArray } from "../layerUtils";

export function useToggle(defaultValue: boolean) {
  const [isActive, setValue] = useState(defaultValue);
  return {
    isActive: isActive,
    activate: () => setValue(true),
    deactivate: () => setValue(false)
  };
}

export function useStateWithGetter<T>(
  getter: () => T
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T | undefined>(undefined);
  return [
    value === undefined ? getter() : value,
    (newValue: T) => setValue(newValue)
  ];
}

function getComponentsThatUseRef(
  refId: string,
  components: T.ComponentMap,
  isLayerUsingRef: (layer: T.Layer, refId: string) => boolean
) {
  return valuesAsArray(components).filter(component =>
    layerTreeToArray(component.layout).some(l => isLayerUsingRef(l, refId))
  );
}

export function useWarningDialog(title: string, description: string) {
  const [isOpen, setIsOpen] = useState(false);
  const okButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isOpen) {
      okButtonRef.current!.focus();
    }
  }, [isOpen]);
  return {
    open: () => setIsOpen(true),
    dialogProps: {
      isOpen,
      title,
      description,
      form: null,
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter") {
          setIsOpen(false);
        } else if (e.key === "Escape") {
          setIsOpen(false);
        }
      }
    },
    okProps: {
      onClick: () => setIsOpen(false),
      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter") {
          e.stopPropagation();
        }
        if (e.key === "Tab") {
          okButtonRef.current!.focus();
          e.preventDefault();
        }
      },
      ref: okButtonRef
    }
  };
}

export function useDeleteRefDialog<TRef extends { name: string }>(
  refTypeName: string,
  refs: Map<string, TRef>,
  selectedRefId: string | null,
  isLayerUsingRef: (layer: T.Layer, refId: string) => boolean,
  components: T.ComponentMap
) {
  const ref = selectedRefId ? refs.get(selectedRefId) : null;
  const description = ref
    ? `${refTypeName} "${
        ref.name
      }" is used by the following components ${getComponentsThatUseRef(
        selectedRefId!,
        components,
        isLayerUsingRef
      )
        .map(c => `"${c.name}"`)
        .join(", ")}.`
    : "";
  return useWarningDialog(
    `Can't delete ${refTypeName.toLowerCase()}`,
    description
  );
}

export function useRefManagement<TRef extends { name: string }>(
  prefix: string,
  refs: Map<string, TRef>,
  onRefsChanges: (newRefs: Map<string, TRef>) => void,
  formEntries: FormEntry<any, any>[],
  prepareEditForm: (ref: TRef) => void,
  formToRef: (name: string) => TRef,
  isLayerUsingRef: (layer: T.Layer, refId: string) => boolean,
  components: T.ComponentMap
) {
  const [selectedRefId, selectRef] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const nameEntry: FormEntry<string, any> = useStringFormEntry("", value =>
    validateRefName(value, selectedRefId, refs, prefix)
  );
  const dialog = useDialogForm([nameEntry].concat(formEntries), () => {
    onRefsChanges(
      set(refs, isEditing ? selectedRefId! : uuid(), formToRef(nameEntry.value))
    );
  });
  const deleteRefDialog = useDeleteRefDialog(
    prefix,
    refs,
    selectedRefId,
    isLayerUsingRef,
    components
  );
  return {
    nameEntry,
    selectedRefId,
    selectRef,
    isEditing,
    dialog,
    deleteRefDialogProps: deleteRefDialog.dialogProps,
    closeDeleteRefDialogProps: deleteRefDialog.okProps,
    refActionsProps: {
      onAdd: () => {
        setIsEditing(false);
        dialog.open();
      },
      canEdit: selectedRefId !== null,
      onEdit: () => {
        if (selectedRefId == null) {
          throw new Error("selectedRefId can't be null on edit");
        }
        const selectedItem = refs.get(selectedRefId);
        if (selectedItem == null) {
          throw new Error("Ref not found");
        }
        setIsEditing(true);
        dialog.open();
        nameEntry.setValue(selectedItem.name);
        prepareEditForm(selectedItem);
      },
      canDelete: selectedRefId !== null && refs.size > 1,
      onDelete: () => {
        const componentsThatUseRef = getComponentsThatUseRef(
          selectedRefId!,
          components,
          isLayerUsingRef
        );
        if (componentsThatUseRef.length > 0) {
          deleteRefDialog.open();
        } else {
          onRefsChanges(del(refs, selectedRefId!));
          selectRef(null);
        }
      }
    }
  };
}
