import SuperGist from 'super-react-gist'

export default function Gist({id, username, file}: {id: string, username: string, file: string}) {
    return <SuperGist url={`https://gist.github.com/${username}/${id}`} file={file}/>
}
