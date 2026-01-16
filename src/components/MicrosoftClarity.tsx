"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

interface MicrosoftClarityProps {
    projectId: string;
}

export const MicrosoftClarity = ({ projectId }: MicrosoftClarityProps) => {
    useEffect(() => {
        if (projectId) {
            Clarity.init(projectId);
        }
    }, [projectId]);

    return null;
};
