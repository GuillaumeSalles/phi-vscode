import React from "react"
import { Profile } from "../Twitter.phi"

import ReactProfile from "../images/ReactProfile.png"
import ReactBackground from "../images/ReactBackground.jpeg"

const IndexPage = () => (
  <Profile
    profileImage={ReactProfile}
    backgroundImage={ReactBackground}
    name="React"
    handle="@reactjs"
    description="React is a declarative, efficient, and flexible JavaScript library for building user interfaces."
    followers="331.6K"
    following="260"
  />
)

export default IndexPage
