export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
    isNameHidden: boolean;
};

export interface Category {
    id: string;
    name: string;
    billboard: Billboard;
};

export interface Product {
    id: string;
    category: Category;
    name: string;
    description: string;
    price: string;
    quantity: number;
    isFeatured: boolean;
    size: Size;
    color: ColorGamut;
    images: Image[];

    selectedQuantity: number;
};

export interface Image {
    id: string;
    url: string;
};

export interface Size {
    id: string;
    name: string;
    value: string;
};

export interface Color {
    id: string;
    name: string;
    value: string;
};