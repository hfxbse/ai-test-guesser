import hexToArrayBuffer from "hex-to-array-buffer";

export default function uuidToBuffer(uuid: string) {
    try {
        return hexToArrayBuffer(uuid.replaceAll('-', ''))
    } catch (e) {
        if (e instanceof RangeError) return null
        else throw e
    }
}
