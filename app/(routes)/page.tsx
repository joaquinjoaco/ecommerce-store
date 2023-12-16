import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/ui/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";

export const revalidate = 0;

const HomePage = async () => {

    const products = await getProducts({ isFeatured: true }); // We want only the featured products on the Homepage.
    const billboard = await getBillboard("a5cd7d80-c071-4257-bc23-51c95b4cabc6");

    return (
        <Container>
            <div className="space-y-10 pb-10">
                <Billboard data={billboard} />
                <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
                    <ProductList title="Productos destacados" items={products} />
                </div>
            </div>

        </Container>
    );
}

export default HomePage;