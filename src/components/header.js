import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `#1c2938`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`
      }}
    >
      <img
        style={{
          width: 48,
        }}
        src={"upside-down-smiley.svg"}
        alt="upside down smiley"
      ></img>
      <h1
        style={{
          margin: `0 0 0 0.4rem`,
          color: `#91D2FA`,
        }}
      >
        {siteTitle}
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
