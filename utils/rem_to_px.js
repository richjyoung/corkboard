export default function(rem) {
    return (rem * parseFloat(getComputedStyle(document.documentElement).fontSize))
}