"use client";

import SelectBox from "@/components/ui/listbox";
import { useState } from "react";


const CheckoutForm = () => {

    const departamentos = [
        "Artigas",
        "Canelones",
        "Cerro Largo",
        "Colonia",
        "Durazno",
        "Flores",
        "Florida",
        "Lavalleja",
        "Maldonado",
        "Montevideo",
        "Paysandú",
        "Río Negro",
        "Rivera",
        "Rocha",
        "Salto",
        "San José",
        "Soriano",
        "Tacuarembó",
        "Treinta y Tres",
    ];

    const [selectedDep, setSelectedDep] = useState(departamentos[0]);
    const [loading, setIsLoading] = useState(false);


    return (

        <div className="flex flex-col  px-4 py-16 sm:px-6 lg:px-8">

            {/* form */}
            <form className="py-8 space-y-6 w-full" onSubmit={() => { }}>
                <h1 className="text-3xl font-bold text-black">Detalles de facturación</h1>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Nombre */}
                    <div className="flex flex-1 flex-col">
                        <label className="pb-1 text-sm">Nombre</label>
                        <input
                            type="text"
                            placeholder="Nombre"
                            disabled={loading}
                            className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>

                    {/* Apellido */}
                    <div className="flex flex-1 flex-col">
                        <label className="pb-1 text-sm">Apellidos</label>
                        <input
                            type="text"
                            placeholder="Apellidos"
                            disabled={loading}
                            className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>
                </div>

                {/* Documento de identidad */}
                <div className="flex flex-col">
                    <label className="pb-1 text-sm">Documento de identidad</label>
                    <input
                        type="text"
                        placeholder="Documento de identidad"
                        disabled={loading}
                        className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                </div>

                {/* Dirección de la calle */}
                <div className="flex flex-col">
                    <label className="pb-1 text-sm">Dirección de la calle</label>
                    <input
                        type="text"
                        placeholder="Número de la casa y nombre de la calle"
                        disabled={loading}
                        className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Apartamento, habitación, etc. (opcional)"
                        disabled={loading}
                        className="flex h-12 w-auto rounded-md border my-2 px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                {/* Ciudad */}
                <div className="flex flex-1 flex-col">
                    <label className="pb-1 text-sm">Ciudad</label>
                    <input
                        type="text"
                        placeholder="Ciudad"
                        disabled={loading}
                        className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                </div>

                {/* Departamento */}
                <div className="flex flex-1 flex-col">
                    <label className="pb-1 text-sm">Departamento</label>
                    <SelectBox values={departamentos} selectedValue={selectedDep} setSelectedValue={setSelectedDep} />
                </div>

                {/* Teléfono */}
                <div className="flex flex-col">
                    <label className="pb-1 text-sm">Teléfono</label>
                    <input
                        type="string"
                        placeholder="Teléfono"
                        disabled={loading}
                        className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="pb-1 text-sm">Dirección de correo electrónico</label>
                    <input
                        type="email"
                        placeholder="Dirección de correo electrónico"
                        disabled={loading}
                        className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                </div>

            </form>
        </div>

    );
}

export default CheckoutForm;