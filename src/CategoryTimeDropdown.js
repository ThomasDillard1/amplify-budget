import { SelectField } from '@aws-amplify/ui-react';

export default function CategoryTimeDropdown(){

    return(
        <SelectField size="small">
            <option value="Total">Total</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="12 months">12 months</option>
        </SelectField>
    )
}