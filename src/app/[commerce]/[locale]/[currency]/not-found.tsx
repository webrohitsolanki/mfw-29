'use client'

import { Button, Image, Link } from "@akinon/next/components";

export default function NotFoundCatchAll() {
    return (
        <>
            <div className="lg:w-6/12 lg:full px-3 mx-auto mb-10 main_container_header">
                <Image width={100} height={100} src='/images/local/error.png' className="error_image flex justify-center" alt="404 Error Not Found" />
                <h2 className="text-3xl text-center mt-2">404, Page not founds</h2>
                <p className="mt-2 text-center">Something went wrong. It’s look that your requested could not be found. It’s look like the link is broken or the page is removed.</p>
                <div className="text-center mx-auto ">
                    <Button className="oransgebtn mt-5 flex items-center gap-2 text-center mx-auto">
                        <Link href='/' className="flex items-end gap-2">
                            <span>
                                <Image width={100} height={100} src='/images/local/home.png' className="error_home" alt="Home" />
                            </span>
                            <span>GO TO HOME</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}