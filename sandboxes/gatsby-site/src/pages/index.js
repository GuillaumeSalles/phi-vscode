import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Profile, Tmp } from "../Twitter.phi"

import ReactProfile from "../images/ReactProfile.png"
import ReactBackground from "../images/ReactBackground.jpeg"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Profile
      profileImage={ReactProfile}
      backgroundImage={ReactBackground}
      name="React"
      handle="@reactjs"
      description="React is a declarative, efficient, and flexible JavaScript library for building user interfaces."
      followers="331.6K"
      following="260"
    />
  </Layout>
)

export default IndexPage
