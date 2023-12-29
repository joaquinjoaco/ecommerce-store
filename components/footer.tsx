import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white border-t">
            <div className="flex flex-row space-x-4 items-center justify-center py-10">
                <p className="text-center text-xs text-black">
                    &copy; 2023 SportPolis. Todos los derechos reservados.
                </p>
                <a href="https://www.instagram.com/sport.polis/?hl=es" target="_blank">
                    <Instagram color="gray" />
                </a>
                <a href="https://www.facebook.com/Sport.Polis/" target="_blank">
                    <Facebook color="darkgray" />
                </a>

            </div>
        </footer>
    );
}

export default Footer;