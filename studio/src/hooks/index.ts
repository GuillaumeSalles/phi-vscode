import { useState } from "react";
import { validateRefName } from "../validators";
import {
  useStringFormEntry,
  FormEntry,
  useDialogForm
} from "../components/Form";
import { del, set } from "../helpers/immutable-map";
import uuid from "uuid/v4";

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

export function useRefManagement<TRef extends { name: string }>(
  prefix: string,
  refs: Map<string, TRef>,
  onRefsChanges: (newRefs: Map<string, TRef>) => void,
  formEntries: FormEntry<any, any>[],
  prepareEditForm: (ref: TRef) => void,
  formToRef: (name: string) => TRef
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
  return {
    nameEntry,
    selectedRefId,
    selectRef,
    isEditing,
    dialog,
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
        onRefsChanges(del(refs, selectedRefId!));
        selectRef(null);
      }
    }
  };
}
