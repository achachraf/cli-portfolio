import {usePostCommand} from "@/hooks/swr/usePostCommand";
import { useState } from "react";

export const useCheckEnv = () => {

    const {trigger: postCommand} = usePostCommand();

    const [isEnvReady, setIsEnvReady] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);

    const checkEnv = () => {
        postCommand({
            tool: 'ls',
            context: {path: '~'},
            params: []
        })
            .then(res => {
                if(res.error) {
                    setIsEnvReady(false);
                }
                else{
                    setIsEnvReady(true);
                }
            })
            .catch(err => {
                setIsEnvReady(false);
            })
            .finally(() => setLoading(false));
    };

    return {
        isEnvReady,
        loading,
        checkEnv
    };
}