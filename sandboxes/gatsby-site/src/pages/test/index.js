import React from "react"
import * as Sample from "../../Sample.phi"

export default function Index() {
  const params = new URLSearchParams(window.location.search)
  return (
    <div id="__testing_root__">
      {React.createElement(Sample[params.get("component")], {}, [])}
    </div>
  )
}
