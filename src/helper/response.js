export const resSuccess = (message, data) => {
    return {
        status: 200,
        message,
        data
    }
}

export const resClientError = (message, data=undefined) => {
    return {
        status: 400,
        message,
        data
    }
}

export const resUnauthorized = () => {
    return {
        status: 401,
        message: "Unauthorized"
    }
}

export const resNotFound = () => {
    return {
        status: 404,
        message: "Data Tidak Ditemukan"
    }
}

export const resServerError = () => {
    return {
        status: 500,
        message: "Terjadi Kesalahan Sistem"
    }
}

export const resNotAllowed = () => {
    return {
        status: 405,
        message: "Method Not Allowed"
    }
}