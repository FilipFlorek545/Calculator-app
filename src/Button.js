export const Button = ({onClick, value, index}) => {
    return(
        <button key={index} onClick={onClick}>{value}</button>
    )
}