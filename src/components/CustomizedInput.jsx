export function CustomizedInput({type = "text", placeholder, value, onChange, list, className = ""}) {

    return(
        <input 
        className={
            "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800" +
            "placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 "
            + className}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        list={list}
        />
    )
};