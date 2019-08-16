import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import { Profile } from "../NewTwitter.neptune"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Profile
      backgroundImage="https://pbs.twimg.com/profile_banners/3227338044/1559684430/1500x500"
      profileImage="https://pbs.twimg.com/profile_images/1135999619781939201/HZ-pCQcP_400x400.png"
    />
    <Profile
      backgroundImage="https://pbs.twimg.com/profile_banners/1566463268/1470764371/1500x500"
      profileImage="https://pbs.twimg.com/profile_images/446356636710363136/OYIaJ1KK_400x400.png"
    />
  </Layout>
)

export default IndexPage
