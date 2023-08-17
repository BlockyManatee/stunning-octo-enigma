import { EscapeHtmlChars } from '../core/core.js';
import { RGBColorToHexString } from './color.js';

export const PropertyType =
{
    Text : 1,
    Integer : 2,
    Number : 3,
    Boolean : 4,
    Percent : 5,
    Color : 6
};

export class Property
{
    constructor (type, name, value)
    {
        this.type = type;
        this.name = name;
        this.value = value;
    }

    /**
     * Returns a property with a new value.
     * @param {*} newValue The new value to set the property to. MAKE SURE THE TYPES MATCH.
     * @returns The new property.
     */
    CloneEdited (newValue)
    {
        return new Property(this.type, this.name, newValue);
    }

    /**
     * Returns the value of the property.
     * @returns The value of the property.
     */
    GetValue()
    {
        return this.value;
    }

    /**
     * Returns the type of the property.
     * @returns The type of the property.
     */
    GetType()
    {
        return this.type;
    }

    /**
     * Returns the name of the property.
     * @returns The name of the property.
     */
    GetName()
    {
        return this.name;
    }

    Clone ()
    {
        const clonable = (this.type === PropertyType.Color);
        if (clonable) {
            return new Property (this.type, this.name, this.value.Clone ());
        } else {
            return new Property (this.type, this.name, this.value);
        }
    }
}

export class PropertyGroup
{
    constructor (name)
    {
        this.name = name;
        this.properties = [];
    }

    PropertyCount ()
    {
        return this.properties.length;
    }

    AddProperty (property)
    {
        this.properties.push (property);
    }

    GetProperty (index)
    {
        return this.properties[index];
    }

    /**
     * Returns all the properties of the property group.
     * @returns {Array} An array of all the properties in the property group.
     */
    GetAllProperties ()
    {
        return this.properties;
    }

    /**
     * Edits the value of a property in the group at a given index. BE CAREFUL TO CHECK THE TYPE.
     * @param {*} index The index of the property to change.
     * @param {*} value The new value for the edited property to hold.
     */
    EditProperty (index, value)
    {
        this.properties[index] = this.properties[index].CloneEdited(value);
    }

    Clone ()
    {
        let cloned = new PropertyGroup (this.name);
        for (let property of this.properties) {
            cloned.AddProperty (property.Clone ());
        }
        return cloned;
    }
}

export function PropertyToString (property)
{
    if (property.type === PropertyType.Text) {
        return EscapeHtmlChars (property.value);
    } else if (property.type === PropertyType.Integer) {
        return property.value.toLocaleString ();
    } else if (property.type === PropertyType.Number) {
        return property.value.toLocaleString (undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else if (property.type === PropertyType.Boolean) {
        return property.value ? 'True' : 'False';
    } else if (property.type === PropertyType.Percent) {
        return parseInt (property.value * 100, 10).toString () + '%';
    } else if (property.type === PropertyType.Color) {
        return '#' + RGBColorToHexString (property.value);
    }
    return null;
}
