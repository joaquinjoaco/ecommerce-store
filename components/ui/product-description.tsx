// isomorphic-dompurify is a wrapper to DOMPurify that can run in the server.

import DOMPurify from "isomorphic-dompurify";

interface DescriptionProps {
    description: string;
}

const ProductDescription: React.FC<DescriptionProps> = ({
    description
}) => {

    // Purified description to prevent XSS attacks.
    const cleanDescription = DOMPurify.sanitize(description);
    return (
        <div dangerouslySetInnerHTML={{ __html: cleanDescription }} />
    );
}

export default ProductDescription;