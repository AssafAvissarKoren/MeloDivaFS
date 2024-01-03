import { useState, useEffect } from 'react';

export const useUpdateAllEmails = (initialState, setAllEmails) => {
    const [emailList, setEmailList] = useState(initialState || []);

    useEffect(() => {
        setAllEmails(async () => await setAllAndListEmails(initialState || []));
    }, [emailList]);

    const setAllAndListEmails = async (updatedEmails) => {
        const updatedHashMap = {};
        const listHashMap = {};
        updatedEmails.forEach((updatedEmail, index) => {
            updatedHashMap[updatedEmail.id] = index;
        });
        emailList.forEach((emailListItem, index) => {
            listHashMap[emailListItem.id] = index;
        });
        const mergedList = emailList.map(emailListItem => {
            if (updatedHashMap.hasOwnProperty(emailListItem.id)) {
                return updatedEmails[updatedHashMap[emailListItem.id]];
            }
            return emailListItem;
        });
        setEmailList(updatedEmails);
        return mergedList;
    }

    return [emailList, setAllAndListEmails];
};
