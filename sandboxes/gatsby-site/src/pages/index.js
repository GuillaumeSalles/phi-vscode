import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import { Profile } from "../Twitter.phi"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Profile
      profileImage="https://pbs.twimg.com/profile_images/446356636710363136/OYIaJ1KK_400x400.png"
      backgroundImage="https://pbs.twimg.com/profile_banners/1566463268/1470764371/1500x500"
      name="React"
      handle="@reactjs"
      description="React is a declarative, efficient, and flexible JavaScript library for building user interfaces."
      followers="331.6K"
      following="260"
    />
    <Profile
      profileImage="https://pbs.twimg.com/profile_images/1095887975781670912/bHjpwZem_400x400.png"
      backgroundImage="https://pbs.twimg.com/profile_banners/4686835494/1520187343/1500x500"
      handle="@zeithq"
      name="ZEIT"
      description="Our mission is to make cloud computing accessible to everyone."
      followers="30.6K"
      following="29"
    />
  </Layout>
)

export default IndexPage
