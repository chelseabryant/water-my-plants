import type { NextPage } from "next"
import Header from "../components/Header"
import React, { Component } from "react"
import ReactDOM from "react-dom"
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "react-responsive-carousel"
import styles from "../styles/Index.module.css"

const Home: NextPage = () => {
  return (
    <div>
      <Header />
      <Carousel className={styles["carousel"]}>
        <div>
          <img src="https://images.unsplash.com/photo-1416339657728-db4f81e78693?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80" />
          <p className="legend">Legend 1</p>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1621274220348-41dc235ff439?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80" />
          <p className="legend">Legend 2</p>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1589467397946-cef51cf0f506?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80" />
          <p className="legend">Legend 3</p>
        </div>
      </Carousel>
    </div>
  )
}

export default Home
