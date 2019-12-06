import React from "react"
import Layout from "../components/layout"
import { Profile } from "../Twitter.phi"

const IndexPage = () => (
  <Layout>
    <Profile
      profileImage="https://pbs.twimg.com/profile_images/1135999619781939201/HZ-pCQcP_400x400.png"
      backgroundImage="https://pbs.twimg.com/profile_banners/3227338044/1559684430/1500x500"
      name="Gatsby"
      handle="@gatsbyjs"
      description="Build blazing fast, modern apps and websites with React"
      followers="999.6K"
      following="100000"
    />

    <Profile
      profileImage="https://pbs.twimg.com/profile_images/1135999619781939201/HZ-pCQcP_400x400.png"
      backgroundImage="https://pbs.twimg.com/profile_banners/3227338044/1559684430/1500x500"
      name="Facebook"
      handle="@gatsbyjs"
      description="Build blazing fast, modern apps and websites with React"
      followers="999.6K"
      following="100"
    />
  </Layout>
)

export default IndexPage
