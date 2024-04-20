export default function (encodedData) {
    try {
        //console.log("running decoding") // DEBUG
        return atob(encodedData.replace(/-/g, '+').replace(/_/g, '/'))
    } catch (e) {	
        console.error("error decoding base64 url")
        return null
    }
}