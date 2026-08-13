import axios from "axios"
const API = axios.create({
    baseURL: "http://localhost:4000/api"
})
export const GetPosts = async () => {
    return await API.get("/post")
}
export const CreatePost = async (post) => {
    return await API.post("/post", post)
}
export const generateAIImage = async (data) => {
    return await API.post("/generate", {data})
}
