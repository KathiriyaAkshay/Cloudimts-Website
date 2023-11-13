const token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_APP_BE_ENDPOINT;

const APIHandler = async (method, payload, route) => {

    try {
        
        let request = `${BASE_URL}${route}` ;  

        let requestOptions = {
            method: `${method}`,
            headers: {
                'Content-Type': 'application/json;charset=utf-8', 
                'Authorization': `Bearer ${token}`
            }
        };   
        
        if (method != "GET"){
            requestOptions['body'] = JSON.stringify(payload)
        }

        let response = await fetch(request, requestOptions) ;  
        
        if (response.status === 401){

            return "Unauthorized" ; 
        }   else{
            let responseData = await response.json() ; 
            return responseData ; 
        }

    } catch (error) {
        console.log(error);
        return false
    }
}

export default APIHandler ; 