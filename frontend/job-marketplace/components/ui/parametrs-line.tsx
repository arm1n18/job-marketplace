import React from 'react';
import * as LucideIcons from 'lucide-react'

interface Props {
    className ?: string;
    IconName: keyof typeof LucideIcons;
    name: string;
    description?: string;
}

export const ParametersLine: React.FC<Props> = ({ IconName, name, description }) => {
    const Icon = LucideIcons[IconName] as React.ComponentType<{ className?: string; strokeWidth?: number }>;

    return (
        <div className="flex gap-1">
            <Icon className="size-4 icon-gray translate-y-1" strokeWidth={2} />
            <span className="text-common-dark">{name}</span>
            <span className="text-common">&nbsp;{description}</span>
        </div>
    );
}