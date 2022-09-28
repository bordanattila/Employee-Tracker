const convert = (string) => {
    let lower = string.toLowerCase();
    const remove = lower.replace(/\s/g, "");
    console.log(remove);
}

convert("   favourite tree    ever")