"use client";

import React, { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from 'lucide-react';
import Currency from '@/components/ui/currency';

interface DeliveryProps {
    setDelivery: React.Dispatch<React.SetStateAction<
        {
            id: number,
            name: string,
            shopAddress: string,
            cost: number
        }
    >>;
}

const options = [
    {
        id: 0,
        name: 'Retiro en local',
        shopAddress: 'Av. Italia 4748',
        cost: 0,
    },
    {
        id: 1,
        name: 'Envío 24-48 horas',
        shopAddress: '',
        cost: 5,
    }
]

const Delivery: React.FC<DeliveryProps> = ({
    setDelivery
}) => {

    const [selected, setSelected] = useState(options[0]);

    const handleOnChange = (value: typeof options[number]) => {
        setDelivery(value);
        setSelected(value);
    };

    return (
        <div className="w-full py-2">
            <div className="w-full">
                <RadioGroup value={selected} onChange={handleOnChange}>
                    <RadioGroup.Label className="sr-only">Envío</RadioGroup.Label>
                    <div className="space-y-2">
                        {options.map((option) => (
                            <RadioGroup.Option
                                key={option.name}
                                value={option}
                                className={({ active, checked }) =>
                                    `${active
                                        ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-[#00AFEE]'
                                        : ''
                                    }
                  ${checked ? 'bg-[#00AFEE] text-white' : 'bg-white'}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                                }
                            >
                                {({ active, checked }) => (
                                    <>
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="text-sm">
                                                    <RadioGroup.Label
                                                        as="p"
                                                        className={`font-medium  ${checked ? 'text-white' : 'text-gray-900'}`}  >
                                                        {option.name}
                                                    </RadioGroup.Label>
                                                    <RadioGroup.Description
                                                        as="span"
                                                        className={`inline ${checked ? 'text-sky-100' : 'text-gray-500'}`}>
                                                        <span>{option.shopAddress}</span>
                                                    </RadioGroup.Description>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 shrink-0">
                                                <Currency className="font-bold" value={option.cost} />
                                                {checked && (
                                                    <span className="text-white">
                                                        <CheckIcon className="h-6 w-6" />
                                                    </span>
                                                )}
                                            </div>

                                        </div>
                                    </>
                                )}
                            </RadioGroup.Option>
                        ))}
                    </div>
                </RadioGroup>
            </div>
        </div>
    )
}

export default Delivery;