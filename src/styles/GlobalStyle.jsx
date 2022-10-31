import React from 'react'
import { Global, css } from "@emotion/react";

const styles = css`
    body {
         padding: 0;
         margin: 0;
    }
`
export default function GlobalStyle() {
  return (
    <Global styles={styles} />
  )
}
