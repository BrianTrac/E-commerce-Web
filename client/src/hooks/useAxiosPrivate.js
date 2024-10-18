import { axiosPrivate } from '../config/axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import useRefreshToken from "./useRefreshToken";
import { error } from 'console';

const useAxiosPrivate = () => {
    const refreshToken = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            async config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refreshToken();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    return axiosPrivate(prevRequest);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        }
    }, [auth, refreshToken]);

    return axiosPrivate;
};

export default useAxiosPrivate;