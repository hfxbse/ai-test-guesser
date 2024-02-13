import {Roboto} from "next/font/google";
import styles from './page.module.css'
import ResultEntry from "@/app/results/[participant]/result-entry";
import RatingSelector from "@/app/components/rating-selector";
import loadResults from "@/app/results/[participant]/action";
import {useMemo} from "react";
import {Metadata} from "next";
import {metadata as layoutMeta} from "@/app/layout";

export const runtime = 'edge'

const roboto = Roboto({weight: "300", subsets: ["latin"]})

export const metadata: Metadata = {
    title: `Results - ${layoutMeta.title}`,
}

export default async function Results({params}: { params: { participant: string } }) {
    const uuid = params.participant

    const {participantResults, averageResults} = await useMemo(
        () => loadResults(uuid), [uuid]
    )

    return <div className={styles.page}>
        <div>
            <h1>Your results</h1>
        </div>
        <div>
            <h2 className={roboto.className}>How often did you identify the tool correctly?</h2>
            <div className={styles.certainty}>
                {
                    [
                        {
                            title: "No AI tools",
                            percentage: participantResults.percentages.human,
                            average: averageResults.percentages.human
                        },
                        {
                            title: "GitHub Copilot",
                            percentage: participantResults.percentages.copilot,
                            average: averageResults.percentages.copilot
                        },
                        {
                            title: "Fully AI generated",
                            percentage: participantResults.percentages.aiGenerated,
                            average: averageResults.percentages.aiGenerated
                        },
                    ].map((result) =>
                        <ResultEntry
                            title={result.title} key={result.title + result.percentage + result.average}
                            percentage={result.percentage}
                            average={result.average}
                        />
                    )
                }

            </div>
        </div>
        <div>
            <h2 className={roboto.className}>Which tests did you like the most on average?</h2>
            {
                [
                    {title: "No AI tools", rating: participantResults.ratings?.human},
                    {title: "GitHub Copilot", rating: participantResults.ratings?.copilot},
                    {title: "Fully AI generated", rating: participantResults.ratings?.aiGenerated},
                ].map(rating =>
                    <div className={styles.ratings} key={rating.title + rating.rating}>
                        <h3>{rating.title}</h3>
                        <RatingSelector rating={rating.rating ?? 0} disabled={true}/>
                    </div>
                )
            }
        </div>
    </div>
}
