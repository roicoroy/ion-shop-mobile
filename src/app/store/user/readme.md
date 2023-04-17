Profile strategy

    profile is the parent page
        we have 2 children
            first: user
                strapi user and edit
                    avatar
                    username
                    email
                    password
                    customerId
                    theme
                    language
            second: customer
                customerId - is a medusa customer id that we can retrieve the complete medusa customer interface data from
                    if we have cookie session we are able to edit customer data
                        else features are locked
                MEDUSA...