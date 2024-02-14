import styles from "./referenceToggle.module.css";

export default function ReferenceToggle({label, onClick, className = ''}: {
    label: string,
    onClick?: () => void,
    className?: string
}) {
    return <button className={`${styles.referenceToggle} ${className}`} onClick={onClick}>
        {label}
    </button>
}
