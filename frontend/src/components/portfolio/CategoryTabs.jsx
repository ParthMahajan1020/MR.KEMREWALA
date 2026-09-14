const CategoryTabs = ({ categories, active, setActive }) => {
    return (
        <div className="category-tabs">
            {categories.map((category) => (
                <button
                key={category.id}
                type="button"
                className={active === category.id ? "active" : ""}
                aria-pressed={active === category.id}
                onClick={() =>
                    setActive(category.id)}
                    >
                        {category.title}
                    </button>
            ))}
        </div>
    );
};

export default CategoryTabs;