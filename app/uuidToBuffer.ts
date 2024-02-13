import hexToArrayBuffer from "hex-to-array-buffer";

export default function uuidToBuffer(uuid: string) {
    return hexToArrayBuffer(uuid.replaceAll('-', ''))
}
