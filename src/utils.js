// requires transition css property set to opacity
export const fadeOut = (element, callback) => {
    if (element)
        element.style.opacity = 0;

    if (callback)
        setTimeout(() => { callback() }, 200);
};

export const parent = (element) => {
    return element?.current?.parentElement;
};