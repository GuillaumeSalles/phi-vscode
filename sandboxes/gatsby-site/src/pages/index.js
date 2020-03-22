import React from "react"
import { Profile } from "../Twitter.phi"

import ReactProfile from "../images/ReactProfile.png"
import ReactBackground from "../images/ReactBackground.jpeg"
import GatsbyProfile from "../images/GatsbyProfile.png"
import GatsbyBackground from "../images/GatsbyBackground.jpeg"

const IndexPage = () => (
  <>
    <Profile
      profileImage={ReactProfile}
      backgroundImage={ReactBackground}
      name="React"
      handle="@reactjs"
      description="React is a declarative, efficient, and flexible JavaScript library for building user interfaces."
      followers="331.6K"
      following="260"
    />
    <Profile
      profileImage={GatsbyProfile}
      backgroundImage={GatsbyBackground}
      name="Gatsby"
      handle="@gatsbyjs"
      description="Build blazing fast, modern apps and websites with React"
      following="35"
      followers="48.7K"
    />
  </>
)

export default IndexPage
