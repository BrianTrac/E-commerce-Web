const getUserById = async (axiosPrivate, id) => {
    const response = await axiosPrivate.get(`/api/users/${id}`);
    return response.data;
};

const getUserByEmail = async (axiosPrivate, email) => {
    const response = await axiosPrivate.get(`/api/users/email/${email}`);
    return response.data;
};

module.exports = { getUserById, getUserByEmail };
