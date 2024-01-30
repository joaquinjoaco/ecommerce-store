import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";
import BillboardSlider from "@/components/ui/billboard-slider";
import getBillboards from "@/actions/get-billboards";

export const revalidate = 0;

const HomePage = async () => {

    const products = await getProducts({ isFeatured: true }); // We want only the featured products on the Homepage.
    {/* TODO: isOnSlider Boolean for billboards an only fetch those with the boolean like the featured products above */ }
    const billboards = await getBillboards();

    return (
        <Container>
            <div className="space-y-10 pb-10">
                <BillboardSlider slides={billboards} />
                <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
                    <ProductList title="Productos destacados" items={products} />
                </div>
            </div>
        </Container >
    );
}

export default HomePage;