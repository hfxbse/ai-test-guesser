"use server"

import {AnswerState} from "@/app/quiz/answer-picker";
import hexToArrayBuffer from "hex-to-array-buffer";

export interface Response {
    quizDuration: number,
    quizResponses: QuizResponse[]
}

export interface QuizResponse {
    gist_id: string,
    gist_user: string,
    files: {
        file: string,
        answer: AnswerState
    }[]
}

function participantCreation({db, quizDuration}: { db: D1Database, quizDuration: number }) {
    const participantUUID = hexToArrayBuffer(crypto.randomUUID().replaceAll('-', ''))

    const participantCreation = db.prepare(`
        INSERT INTO participants (uuid, quiz_duration)
        VALUES (?1, ?2);`
    );

    return {
        participantUUID,
        participantCreationStatement: participantCreation.bind(participantUUID, quizDuration)
    }
}

async function snippetResponseCreation({db, quizResponses}: {
    db: D1Database,
    quizResponses: QuizResponse[],
}) {
    async function mapResponsesToSnippets(db: D1Database, responses: QuizResponse[]) {
        const gists = await db.prepare('SELECT * FROM gists').all()

        if (gists.error !== undefined) throw gists.error

        return responses.map(response => {
            const gist = gists.results.find((gist) => {
                return gist["gist_id"] === response.gist_id && gist["gist_user"] === response.gist_user;
            })

            function mapFile(category: string) {
                return response.files.find((file) => file.file === gist?.[`file_${category}`])?.answer
            }

            return {
                gist: {
                    id: gist?.["gist_id"] as string,
                    user: gist?.["gist_user"] as string,
                },
                human: mapFile('human'),
                copilot: mapFile('copilot'),
                generated: mapFile('generated')
            }
        })
    }

    const snippetResponses = await mapResponsesToSnippets(db, quizResponses);

    const responseCreation = db.prepare(`
        INSERT INTO snippet_responses (guess, rating, text)
        VALUES (?1, ?2, ?3)
        RETURNING id;
    `)

    function notEmptyOrNull(text: string | null | undefined) {
        return (text?.trim()?.length ?? 0) > 0 ? text!.trim() : null;
    }

    function bindResponseCreation(answers: AnswerState | undefined) {
        return responseCreation.bind(
            answers?.guess,
            answers?.rating,
            notEmptyOrNull(answers?.text)
        )
    }

    const snippetResponsesCreationStatements = snippetResponses.map(response => {
        return [
            bindResponseCreation(response.human),
            bindResponseCreation(response.copilot),
            bindResponseCreation(response.generated)
        ]
    }).reduce((all, current) => {
        all.push(...current)
        return all
    }, [])


    function mapSnippetCreationResponses(creationResponses: D1Result[]) {
        const results: {
            human: D1Result,
            copilot: D1Result,
            generated: D1Result,
            gist: { id: string, user: string }
        }[] = []

        while (creationResponses.length >= 3) {
            const snippets = creationResponses.splice(0, 3)
            const gist = snippetResponses.splice(0, 1)[0]

            results.push({
                gist: gist.gist,
                human: snippets[0],
                copilot: snippets[1],
                generated: snippets[2]
            })
        }

        return results
    }


    return {snippetResponsesCreationStatements, mapSnippetCreationResponses}
}

export async function submitResponses(responses: Response) {
    const db = process.env.DB;

    const {participantUUID, participantCreationStatement} = participantCreation({
        db,
        quizDuration: responses.quizDuration
    });

    const {snippetResponsesCreationStatements, mapSnippetCreationResponses} = await snippetResponseCreation({
        db,
        quizResponses: responses.quizResponses,
    })

    const creationResults = await db.batch([
        participantCreationStatement,
        ...snippetResponsesCreationStatements
    ])

    if (creationResults[0].error !== undefined) throw creationResults[0].error

    const snippetCreationResults = mapSnippetCreationResponses(creationResults.slice(1))

    const createQuizResults = db.prepare(`
        INSERT INTO quiz_responses (participant_uuid, gist_id, gist_user, response_human, response_copilot,
                                    response_generated)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6);
    `)

    await db.batch(snippetCreationResults.map(result => {
        function getGeneratedId(result: D1Result) {
            return (result.results as { "id": number }[])[0]["id"]
        }

        return createQuizResults.bind(
            participantUUID,
            result.gist.id,
            result.gist.user,
            getGeneratedId(result.human),
            getGeneratedId(result.copilot),
            getGeneratedId(result.generated),
        );
    }))
}
