import uuidToBuffer from "@/app/uuidToBuffer";
import {redirect} from "next/navigation";

export default async function loadResults(uuid: string) {
    "use server"

    const db = process.env.DB

    const participantUUID = uuidToBuffer(uuid)

    const participant = await db.prepare(
        "SELECT 1 FROM participants WHERE uuid = ?1"
    ).bind(participantUUID).first()

    if (participant === null) redirect('/')

    function readResults(results: D1Result[]) {
        const firstResult = results[0].results[0] as Record<string, number>

        if (results[0] === undefined || results[0]?.error !== undefined) {
            throw results[0]?.error ?? 'Response count is missing'
        }

        function getCount(result: D1Result) {
            return (result.results as [{ "count(*)": number }])[0]["count(*)"]
        }

        const answerCount = getCount(results[0])

        const percentages = {
            human: getCount(results[1]) * 100 / answerCount,
            copilot: getCount(results[2]) * 100 / answerCount,
            aiGenerated: getCount(results[3]) * 100 / answerCount,
        }

        if (firstResult["sum(human.rating)"] !== undefined) {
            return {
                percentages,
                ratings: {
                    human: firstResult["sum(human.rating)"],
                    copilot: firstResult["sum(copilot.rating)"],
                    aiGenerated: firstResult["sum(ai_generated.rating)"]
                }
            }
        }

        return {percentages}
    }

    const results = await db.batch([
        // participant correct responses
        db.prepare(`
            SELECT count(*), sum(human.rating), sum(copilot.rating), sum(ai_generated.rating)
            FROM quiz_responses
                     LEFT JOIN snippet_responses AS human ON quiz_responses.response_human = human.id
                     LEFT JOIN snippet_responses AS copilot ON quiz_responses.response_copilot = copilot.id
                     LEFT JOIN snippet_responses AS ai_generated
                               ON quiz_responses.response_ai_generated = ai_generated.id
            WHERE quiz_responses.participant_uuid = ?1
        `).bind(participantUUID),

        db.prepare(`
            SELECT count(*)
            FROM quiz_responses
                     INNER JOIN snippet_responses ON quiz_responses.response_human = snippet_responses.id
            WHERE quiz_responses.participant_uuid = ?1
              AND snippet_responses.guess = 'human'
        `).bind(participantUUID),
        db.prepare(`
            SELECT count(*)
            FROM quiz_responses
                     INNER JOIN snippet_responses ON quiz_responses.response_copilot = snippet_responses.id
            WHERE quiz_responses.participant_uuid = ?1
              AND snippet_responses.guess = 'copilot'
        `).bind(participantUUID),
        db.prepare(`
            SELECT count(*)
            FROM quiz_responses
                     INNER JOIN snippet_responses ON quiz_responses.response_ai_generated = snippet_responses.id
            WHERE quiz_responses.participant_uuid = ?1
              AND snippet_responses.guess = 'ai-generated'
        `).bind(participantUUID),

        // average correct responses
        db.prepare("SELECT count(*) FROM quiz_responses WHERE participant_uuid <> ?1").bind(participantUUID),
        db.prepare(`
            SELECT count(*)
            FROM quiz_responses
                     INNER JOIN snippet_responses ON quiz_responses.response_human = snippet_responses.id
            WHERE quiz_responses.participant_uuid <> ?1
              AND snippet_responses.guess = 'human'
        `).bind(participantUUID),
        db.prepare(`
            SELECT count(*)
            FROM quiz_responses
                     INNER JOIN snippet_responses ON quiz_responses.response_copilot = snippet_responses.id
            WHERE quiz_responses.participant_uuid <> ?1
              AND snippet_responses.guess = 'copilot'
        `).bind(participantUUID),
        db.prepare(`
            SELECT count(*)
            FROM quiz_responses
                     INNER JOIN snippet_responses ON quiz_responses.response_ai_generated = snippet_responses.id
            WHERE quiz_responses.participant_uuid <> ?1
              AND snippet_responses.guess = 'ai-generated'
        `).bind(participantUUID),

    ])

    const participantResults = readResults(results.splice(0, 4))
    const averageResults = readResults(results.splice(0, 4))

    return {
        participantResults,
        averageResults
    }
}
