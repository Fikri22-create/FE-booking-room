import api from "./api";

export const getPayments = async (params) => {
    const response = await api.get(
        "/payments",
        { params }
    );

    return response.data;
};

export const getPaymentById = async (id) => {
    const response = await api.get(
        `/payments/${id}`
    );

    return response.data;
};

export const verifyPayment = async (id) => {
    const response = await api.patch(
        `/payments/${id}/verify`
    );

    return response.data;
};

export const refundPayment = async (id) => {
    const response = await api.patch(
        `/payments/${id}/refund`
    );

    return response.data;
};