export interface Gist {
    id: string,
    github_username: string,
    filenames: string[]
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
    const gists: Gist[] = [
        {
            id: "02faf8925f845a6438f9997dfbe579e3",
            github_username: "hfxbse",
            filenames: ["reference.dart", "copilot.dart", "welltested.dart"],
        },
        {
            id: "d13b75a356e253b1f1ba4f35cb0476f3",
            github_username: "hfxbse",
            filenames: ["reference.dart", "copilot.dart", "welltested.dart"],
        }
    ];

    return Response.json(gists)
}
