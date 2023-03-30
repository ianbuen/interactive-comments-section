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

export const getTimeStamp = (then) => {
    let now = new Date();
    let diff = Math.floor((now - then) / 1000); // time diff in secs

    if (diff < 10)
        return 'just now';

    if (diff < 60) // less than a min
        return `${diff} secs ago`;

    if (diff < 3600) { // less than an hour
        diff = Math.floor(diff / 60);
        return `${diff} ${diff > 1 ? 'mins' : 'min'} ago`;
    }

    if (diff < 3600 * 24) { // less than a day
        diff = Math.floor(diff / 3600);
        return `${diff} ${diff > 1 ? 'hours' : 'hour'} ago`;
    }

    if (diff < 3600 * 24 * 7) { // less than a week
        diff = Math.floor(diff / 3600 / 24);
        return `${diff} ${diff > 1 ? 'days' : 'day'} ago`;
    }

    if (diff < 3600 * 24 * 30) { // less than a month
        diff = Math.floor(diff / 3600 / 24 / 7);
        return `${diff} ${diff > 1 ? 'weeks' : 'week'} ago`;
    }

    if (diff < 3600 * 24 * 30 * 12) { // less than a year
        diff = Math.floor(diff / 3600 / 24 / 30);
        return `${diff} ${diff > 1 ? 'months' : 'month'} ago`;
    }

    diff = Math.floor(diff / 3600 / 24 / 30 / 12);
    return `${diff} ${diff > 1 ? 'years' : 'year'} ago`;
};