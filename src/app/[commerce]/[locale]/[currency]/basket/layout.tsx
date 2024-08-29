import React from "react";
import Page from "../basket/page";
// import FeatureRecommended from "@theme/widgets/home/feature/feature-reccomendation";
import HomeProductRecommendation from "./basket-one";
import HomeProductRecommendationThree from "./basket-three";
import HomeProductRecommendationTwo from "./basket-two";

export default function BasketRecommendation() {


    return (
        <>
            <Page />
            <div className="mt-5">
                <p className="text-center lg:text-4xl text-2xl font-thick">You May Also Like</p>
                {/* <FeatureRecommended type={'shoes'} /> */}
                <HomeProductRecommendation  />
                <HomeProductRecommendationTwo  />
                <HomeProductRecommendationThree />
            </div>
        </>
    )
}