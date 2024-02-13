import arrayShuffle from "array-shuffle";

export interface Gist {
    id: string,
    gist_user: string,
    filenames: string[]
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
    const db = process.env.DB;

    const result = await db.prepare("SELECT * FROM gists").all()

    if (!result.success) {
        return Response.error()
    }

    const gists: Gist[] = result.results.map(entry => {
        return {
            id: entry["gist_id"] as string,
            gist_user: entry["gist_user"] as string,
            // shuffle order to prevent cheating
            filenames: arrayShuffle([
                entry["file_human"],
                entry["file_copilot"],
                entry["file_ai_generated"],
            ] as string[])
        }
    })

    return Response.json(gists)
}
