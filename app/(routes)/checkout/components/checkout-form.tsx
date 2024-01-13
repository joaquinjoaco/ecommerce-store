"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

import useCart from "@/hooks/use-cart";
import SelectBox from "@/components/ui/listbox";
import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import CheckoutItem from "./checkout-item";
import Delivery from "./checkout-delivery";
import Required from "./checkout-required";


const CheckoutForm = () => {

    // init MercadoPago
    initMercadoPago('TEST-128644b4-d8f5-4468-a070-6ac61fc3e562', {
        locale: "es-UY",
    });

    // Send to another address?
    const [differentAddress, setDifferentAddress] = useState(false);
    // Delivery method
    const [deliveryMethod, setDeliveryMethod] = useState({
        id: 0,
        name: 'Retiro en local',
        shopAddress: 'Av. Italia 4748',
        cost: 0,
    });

    // Zod formSchema declared inside so we can use 'differentAddress' to conditionally make some fields optional or required.
    const formSchema = z.object({
        firstName: z.string().min(1, { message: 'Este campo es obligatorio' }).max(64, { message: "No puede contener más de 64 caracteres" }),
        lastName: z.string().min(1, { message: 'Este campo es obligatorio' }).max(64, { message: "No puede contener más de 64 caracteres" }),
        cedula: z.string().min(8, { message: 'La cédula debe tener un mínimo de 8 dígitos' }).max(8, { message: 'La cédula no puede tener más de 8 dígitos' }),
        address1: z.string().min(1, { message: 'Este campo es obligatorio' }).max(64, { message: "No puede contener más de 64 caracteres" }),
        address2: z.string().max(64, { message: "No puede contener más de 64 caracteres" }).optional(),
        city: z.string().min(1, { message: 'Este campo es obligatorio' }).max(32, { message: "No puede contener más de 32 caracteres" }),
        postalcode: z.string().min(1, { message: 'Este campo es obligatorio' }).max(32, { message: "No puede contener más de 32 caracteres" }),
        phone: z.string().min(1, { message: 'Este campo es obligatorio' }).max(32, { message: "No puede contener más de 32 caracteres" }),
        email: z.string().min(1, { message: 'Este campo es obligatorio' }).email("El email no es válido"),
        notes: z.string().max(256, { message: "No puede contener más de 64 caracteres" }).optional(),

        // DELIVERY CONDITONALLY OPTIONAL FIELDS.
        deliveryName: z.string().max(64, { message: "No puede contener más de 64 caracteres" })
            // required when differentAddress === true
            .refine(data => !differentAddress || (data && data.trim().length > 0), {
                message: "Este campo es obligatorio",
            })
            .optional(),
        deliveryLastname: z.string().max(64, { message: "No puede contener más de 64 caracteres" })
            // required when differentAddress === true
            .refine(data => !differentAddress || (data && data.trim().length > 0), {
                message: "Este campo es obligatorio",
            })
            .optional(),
        deliveryCedula: z.string().max(8, { message: 'La cédula no puede tener más de 8 dígitos' })
            // required when differentAddress === true
            .refine(data => !differentAddress || (data && data.trim().length > 0), {
                message: "Este campo es obligatorio",
            })
            .optional(),
        deliveryAddress1: z.string().max(64, { message: "No puede contener más de 64 caracteres" })
            // required when differentAddress === true
            .refine(data => !differentAddress || (data && data.trim().length > 0), {
                message: "Este campo es obligatorio",
            })
            .optional(),
        deliveryAddress2: z.string().max(64, { message: "No puede contener más de 64 caracteres" })
            // always optional
            .optional(),
        deliveryCity: z.string().max(32, { message: "No puede contener más de 32 caracteres" })
            // required when differentAddress === true
            .refine(data => !differentAddress || (data && data.trim().length > 0), {
                message: "Este campo es obligatorio",
            })
            .optional(),
        deliveryPostalcode: z.string().max(32, { message: "No puede contener más de 32 caracteres" })
            // required when differentAddress === true
            .refine(data => !differentAddress || (data && data.trim().length > 0), {
                message: "Este campo es obligatorio",
            })
            .optional(),
        deliveryPhone: z.string().max(32, { message: "No puede contener más de 32 caracteres" })
            // required when differentAddress === true
            .refine(data => !differentAddress || (data && data.trim().length > 0), {
                message: "Este campo es obligatorio",
            })
            .optional(),

        // PICKUP CONDITIONALLY OPTIONAL FIELDS.
        pickupFullName: z.string().max(64, { message: "No puede contener más de 64 caracteres" })
            // required when deliveryMethod.id === 1
            .refine(data => deliveryMethod.id === 1 || (data && data.trim().length > 0), {
                message: "Este campo es obligatorio",
            })
            .optional(),
        pickupCedula: z.string().max(8, { message: "La cédula no puede tener más de 8 dígitos" })
            // required when deliveryMethod.id === 1
            .refine(data => deliveryMethod.id === 1 || (data && data.trim().length > 0), {
                message: "Este campo es obligatorio",
            })
            .optional(),
        TandC: z.boolean().default(false)
    });

    type CheckoutFormValues = z.infer<typeof formSchema>;

    // Form object
    const {
        register,
        handleSubmit,
        watch,
        reset,
        trigger,
        formState: { errors }
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            cedula: '',
            address1: '',
            address2: '',
            city: '',
            phone: '',
            email: '',
            notes: '',
            deliveryAddress1: '',
            deliveryAddress2: '',
            deliveryCedula: '',
            deliveryCity: '',
            deliveryLastname: '',
            deliveryName: '',
            deliveryPhone: '',
            deliveryPostalcode: '',
            pickupCedula: '',
            pickupFullName: '',
            postalcode: '',
            TandC: false,
        }
    });

    // Loading flag.
    const [loading, setIsLoading] = useState(false);

    // Terms and conditions boolean.
    const [TC, setTC] = useState(false);

    // NextJS Router.
    const router = useRouter();

    // Cart Items.
    const items = useCart((state) => state.items);
    // Subtotal price.
    const subtotalPrice = items.reduce((total, item) => {
        return total + Number(item.price)
    }, 0); // initial value 0.
    // Total price.
    const totalPrice = subtotalPrice + deliveryMethod.cost;


    // Departamentos
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
    const [selectedDeliveryDep, setSelectedDeliveryDep] = useState(departamentos[0]);

    const [preferenceId, setPreferenceId] = useState(null);

    // Preference creation
    // const createPreference = async () => {
    //     try {
    //         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
    //             title: "Bananita contenta",
    //             quantity: 1,
    //             price: 100,
    //         });

    //         const { id } = response.data;
    //         return id;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // On submit function
    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setIsLoading(true);
            const order = {
                ...data,

                departamento: selectedDep,
                differentAddress: differentAddress,
                deliveryAddress1: differentAddress ? data.deliveryAddress1 : "",
                deliveryAddress2: differentAddress ? data.deliveryAddress2 : "",
                deliveryCedula: differentAddress ? data.deliveryCedula : "",
                deliveryCity: differentAddress ? data.deliveryCity : "",
                deliveryLastname: differentAddress ? data.deliveryLastname : "",
                deliveryName: differentAddress ? data.deliveryName : "",
                deliveryPhone: differentAddress ? data.deliveryPhone : "",
                deliveryPostalcode: differentAddress ? data.deliveryPostalcode : "",
                deliveryDepartamento: deliveryMethod.id === 1 ? differentAddress ? selectedDeliveryDep : selectedDep : "",

                deliveryMethod: deliveryMethod.id, // 0: pickup, 1: delivery
                deliveryMethodName: deliveryMethod.name,
                deliveryMethodShopAddress: deliveryMethod.shopAddress,
                deliveryMethodCost: deliveryMethod.cost,

                pickupCedula: deliveryMethod.id === 0 ? data.pickupCedula : "",
                pickupFullName: deliveryMethod.id === 0 ? data.pickupFullName : "",
                productIds: items.map((item) => item.id),
                totalPrice: totalPrice,
                subtotalPrice: subtotalPrice,
                TandC: TC,
            }

            // Place the order, returns preference id from MercadoPago.
            // Once the user has paid, they will be redirected to the cart page with the corresponding searchParams.
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                productIds: items.map((item) => item.id),
                orderData: order
            });

            // console.log(response.data.url);
            // window.location = response.data.url;
            // reset();

            const id = response.data.id;
            if (id) {
                setPreferenceId(id);
            }
            setIsLoading(false);

        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // This route cannot be accessed with an empty cart.
        if (items.length === 0) {
            router.push("/carrito");
        }
    }, []);

    // hydration trick.
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (

        <div className="flex flex-col px-4 py-16 sm:px-6 lg:px-8">

            <h1 className="text-3xl font-bold text-black">Detalles de facturación</h1>

            {/* form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col py-8 space-y-6 w-full lg:flex-row lg:space-x-6"
            >
                <div className="space-y-6 flex-1 ">
                    {/* Nombre & Apellidos */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Nombre */}
                        <div className="flex flex-1 flex-col">
                            <label className="pb-1 text-sm">Nombre <Required /></label>
                            <input
                                type="text"
                                placeholder="Nombre"
                                disabled={loading}
                                className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...register('firstName')}
                            />
                            {errors.firstName?.message && (
                                <p className='mt-2 text-sm text-red-400'>
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        {/* Apellidos */}
                        <div className="flex flex-1 flex-col">
                            <label
                                className="pb-1 text-sm">Apellidos <Required /></label>
                            <input
                                type="text"
                                placeholder="Apellidos"
                                disabled={loading}
                                className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...register('lastName')}
                            />
                            {errors.lastName?.message && (
                                <p className='mt-2 text-sm text-red-400'>
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Documento de identidad */}
                    <div className="flex flex-col">
                        <label className="pb-1 text-sm">Documento de identidad <Required /></label>
                        <input
                            type="text"
                            placeholder="Documento de identidad (sin puntos ni guiones)"
                            disabled={loading}
                            className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('cedula')}
                        />
                        {errors.cedula?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.cedula.message}
                            </p>
                        )}
                    </div>

                    {/* Dirección de la calle */}
                    <div className="flex flex-col">
                        <p className="text-md font-medium">País / Región <Required /></p>
                        <p className="pb-4 text-md font-bold">Uruguay</p>
                        <label className="pb-1 text-sm">Dirección de la calle <Required /></label>
                        <input
                            type="text"
                            placeholder="Número de la casa y nombre de la calle"
                            disabled={loading}
                            className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('address1')}
                        />
                        {errors.address1?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.address1.message}
                            </p>
                        )}
                        <input
                            type="text"
                            placeholder="Apartamento, habitación, etc. (opcional)"
                            disabled={loading}
                            className="flex h-12 w-auto rounded-md border my-2 px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('address2')}
                        />
                        {errors.address2?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.address2.message}
                            </p>
                        )}
                    </div>

                    {/* Ciudad */}
                    <div className="flex flex-1 flex-col">
                        <label className="pb-1 text-sm">Ciudad <Required /></label>
                        <input
                            type="text"
                            placeholder="Ciudad"
                            disabled={loading}
                            className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('city')}
                        />
                        {errors.city?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.city.message}
                            </p>
                        )}
                    </div>

                    {/* Código postal */}
                    <div className="flex flex-1 flex-col">
                        <label className="pb-1 text-sm">Código postal <Required /></label>
                        <input
                            type="text"
                            placeholder="Código postal"
                            disabled={loading}
                            className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('postalcode')}
                        />
                        {errors.postalcode?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.postalcode.message}
                            </p>
                        )}
                    </div>
                    {/* Departamento */}
                    <div className="flex flex-1 flex-col">
                        <label className="pb-1 text-sm">Departamento <Required /></label>
                        <SelectBox values={departamentos} selectedValue={selectedDep} setSelectedValue={setSelectedDep} />
                    </div>

                    {/* Teléfono */}
                    <div className="flex flex-col">
                        <label className="pb-1 text-sm">Teléfono <Required /></label>
                        <input
                            type="string"
                            placeholder="Teléfono"
                            disabled={loading}
                            className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('phone')}
                        />
                        {errors.phone?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="pb-1 text-sm">Dirección de correo electrónico <Required /></label>
                        <input
                            type="email"
                            placeholder="Dirección de correo electrónico"
                            disabled={loading}
                            className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('email')}
                        />
                        {errors.email?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* ========= Envío a otra dirección ========= */}
                    <div className="flex flex-row items-center space-x-2">
                        <input
                            type="checkbox"
                            placeholder="Dirección de correo electrónico"
                            disabled={loading}
                            className="flex my-5 h-5 w-5 rounded-md border px-3 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultChecked={differentAddress}
                            onChange={() => setDifferentAddress(!differentAddress)}
                        />
                        <label className="text-md">¿Envíar a otra dirección?</label>
                    </div>

                    {differentAddress &&
                        <div className="rounded-md space-y-6 bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                            <p className="text-xl font-bold">Dirección de envío</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Nombre de envío */}
                                <div className="flex flex-1 flex-col">
                                    <label className="pb-1 text-sm">Nombre <Required /></label>
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        disabled={loading}
                                        className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register('deliveryName')}
                                    />
                                    {errors.deliveryName?.message && (
                                        <p className='mt-2 text-sm text-red-400'>
                                            {errors.deliveryName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Apellido de envío */}
                                <div className="flex flex-1 flex-col">
                                    <label className="pb-1 text-sm">Apellidos <Required /></label>
                                    <input
                                        type="text"
                                        placeholder="Apellidos"
                                        disabled={loading}
                                        className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register('deliveryLastname')}
                                    />
                                    {errors.deliveryLastname?.message && (
                                        <p className='mt-2 text-sm text-red-400'>
                                            {errors.deliveryLastname.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Documento de identidad de envío */}
                            <div className="flex flex-col">
                                <label className="pb-1 text-sm">Documento de identidad <Required /></label>
                                <input
                                    type="text"
                                    placeholder="Documento de identidad (sin puntos ni guiones)"
                                    disabled={loading}
                                    className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register('deliveryCedula')}
                                />
                                {errors.deliveryCedula?.message && (
                                    <p className='mt-2 text-sm text-red-400'>
                                        {errors.deliveryCedula.message}
                                    </p>
                                )}
                            </div>

                            {/* Dirección de la calle de envío */}
                            <div className="flex flex-col">
                                <p className="text-md font-medium">País / Región <Required /></p>
                                <p className="pb-4 text-md font-bold">Uruguay</p>
                                <label className="pb-1 text-sm">Dirección de la calle <Required /></label>
                                <input
                                    type="text"
                                    placeholder="Número de la casa y nombre de la calle"
                                    disabled={loading}
                                    className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register('deliveryAddress1')}
                                />
                                {errors.deliveryAddress1?.message && (
                                    <p className='mt-2 text-sm text-red-400'>
                                        {errors.deliveryAddress1.message}
                                    </p>
                                )}
                                <input
                                    type="text"
                                    placeholder="Apartamento, habitación, etc. (opcional)"
                                    disabled={loading}
                                    className="flex h-12 w-auto rounded-md border my-2 px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register('deliveryAddress2')}
                                />
                                {errors.deliveryAddress2?.message && (
                                    <p className='mt-2 text-sm text-red-400'>
                                        {errors.deliveryAddress2.message}
                                    </p>
                                )}
                            </div>

                            {/* Ciudad de envío */}
                            <div className="flex flex-1 flex-col">
                                <label className="pb-1 text-sm">Ciudad <Required /></label>
                                <input
                                    type="text"
                                    placeholder="Ciudad"
                                    disabled={loading}
                                    className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register('deliveryCity')}
                                />
                                {errors.deliveryCity?.message && (
                                    <p className='mt-2 text-sm text-red-400'>
                                        {errors.deliveryCity.message}
                                    </p>
                                )}
                            </div>

                            {/* Código postal de envío */}
                            <div className="flex flex-1 flex-col">
                                <label className="pb-1 text-sm">Código postal <Required /></label>
                                <input
                                    type="text"
                                    placeholder="Código postal"
                                    disabled={loading}
                                    className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register('deliveryPostalcode')}
                                />
                                {errors.deliveryPostalcode?.message && (
                                    <p className='mt-2 text-sm text-red-400'>
                                        {errors.deliveryPostalcode.message}
                                    </p>
                                )}
                            </div>

                            {/* Departamento de envío */}
                            <div className="flex flex-1 flex-col">
                                <label className="pb-1 text-sm">Departamento <Required /></label>
                                <SelectBox values={departamentos} selectedValue={selectedDeliveryDep} setSelectedValue={setSelectedDeliveryDep} />
                            </div>

                            {/* Teléfono de envío */}
                            <div className="flex flex-col">
                                <label className="pb-1 text-sm">Teléfono <Required /></label>
                                <input
                                    type="string"
                                    placeholder="Teléfono"
                                    disabled={loading}
                                    className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register('deliveryPhone')}
                                />
                                {errors.deliveryPhone?.message && (
                                    <p className='mt-2 text-sm text-red-400'>
                                        {errors.deliveryPhone.message}
                                    </p>
                                )}
                            </div>

                        </div>
                    }

                    {/* Notas del pedido */}
                    <div className="flex flex-col">
                        <label className="pb-1 text-sm">Notas del pedido (opcional)</label>
                        <textarea
                            placeholder="Notas sobre tu pedido, detalles, notas especiales para la entrega."
                            disabled={loading}
                            className="flex h-32 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('notes')}
                        />
                        {errors.notes?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.notes.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    {/* Tu pedido */}
                    <div className="space-y-6 rounded-lg border-2 border-gray-200 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">

                        <p className="text-xl font-bold">Tu pedido</p>
                        {items.map((item) => (
                            <CheckoutItem key={item.id} data={item} />
                        ))}
                        {/* Subtotal */}
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between border-b py-4 border-gray-200 pt-4">
                                <div className="text-base font-bold text-gray-900">
                                    Subtotal
                                </div>
                                <div className="font-bold">
                                    <Currency value={subtotalPrice} />
                                </div>
                            </div>
                        </div>
                        {/* Opción de envío*/}
                        <div className="flex flex-col">
                            <label className="pb-1 text-md font-bold">Envío</label>
                            <Delivery setDelivery={setDeliveryMethod} />
                        </div>
                        {/* Retiro? */}
                        {deliveryMethod.id === 0 ?
                            (
                                <div className="rounded-md space-y-6 bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                                    {/* Nombre */}
                                    <div className="flex flex-1 flex-col">
                                        <label className="pb-1 text-sm">Nombre de quien retira <Required /></label>
                                        <input
                                            type="text"
                                            placeholder="Ingrese el nombre completo"
                                            disabled={loading}
                                            className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            {...register('pickupFullName')}
                                        />
                                        {errors.pickupFullName?.message && (
                                            <p className='mt-2 text-sm text-red-400'>
                                                {errors.pickupFullName.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <label className="pb-1 text-sm">Cédula de quien retira <Required /></label>
                                        <input
                                            type="text"
                                            placeholder="Ingrese la cédula de quien retira (sin puntos ni guiones)"
                                            disabled={loading}
                                            className="flex h-12 w-auto rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            {...register('pickupCedula')}
                                        />
                                        {errors.pickupCedula?.message && (
                                            <p className='mt-2 text-sm text-red-400'>
                                                {errors.pickupCedula.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                            : null
                        }

                        {/* Total */}
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between border-t py-4 border-gray-200 pt-4">
                                <div className="text-xl font-bold text-gray-900">
                                    Total
                                </div>
                                <div className="text-xl font-extrabold">
                                    <Currency value={totalPrice} />
                                </div>
                            </div>
                        </div>
                        {/* Terminos y condiciones */}
                        <div className="flex flex-row items-center space-x-2">
                            <input
                                type="checkbox"
                                disabled={loading}
                                className="flex my-5 h-5 w-5 rounded-md border px-3 text-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AFEE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                defaultChecked={TC}
                                onChange={() => setTC(!TC)}
                            />
                            <label className="text-md">He leído y estoy de acuerdo con los términos y condiciones de la web</label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={TC === false}
                        // onClick={() => router.push("/checkout")} 
                        className="w-full mt-6">
                        Proceder con el pago
                    </Button>

                    {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} />}

                </div>

            </form>
        </div>

    );
}

export default CheckoutForm;