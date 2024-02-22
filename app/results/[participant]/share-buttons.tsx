'use client'

import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LineIcon,
    LineShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton, TwitterIcon, TwitterShareButton,
    ViberIcon,
    ViberShareButton, WeiboIcon,
    WeiboShareButton, WhatsappIcon, WhatsappShareButton, WorkplaceIcon, WorkplaceShareButton
} from "react-share";
import {usePathname} from "next/navigation";

export default function ShareButtons() {
    const path = usePathname()
    const url = typeof window === 'undefined' ? path : window?.location?.href

    return <div>
        <FacebookShareButton url={url}>
            <FacebookIcon/>
        </FacebookShareButton>
        <TwitterShareButton url={url}>
            <TwitterIcon/>
        </TwitterShareButton>
        <WhatsappShareButton url={url}>
            <WhatsappIcon/>
        </WhatsappShareButton>
        <LinkedinShareButton url={url}>
            <LinkedinIcon/>
        </LinkedinShareButton>
        <RedditShareButton url={url}>
            <RedditIcon/>
        </RedditShareButton>
        <LineShareButton url={url}>
            <LineIcon/>
        </LineShareButton>
        <TelegramShareButton url={url}>
            <TelegramIcon/>
        </TelegramShareButton>
        <EmailShareButton url={url}>
            <EmailIcon/>
        </EmailShareButton>
        <ViberShareButton url={url}>
            <ViberIcon/>
        </ViberShareButton>
        <WeiboShareButton url={url}>
            <WeiboIcon/>
        </WeiboShareButton>
        <WorkplaceShareButton url={url}>
            <WorkplaceIcon/>
        </WorkplaceShareButton>
    </div>
}
