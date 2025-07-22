import Axios, { AxiosResponse } from "axios";
import axios from "axios";
import { getSession } from "./serverActions/sessionAction";
import { DataProps, JwtPayload } from './serverActions/interfaces';
import Swal from 'sweetalert2';
import logger from './logger';
import useAxios from './useAxios';
import { jwtDecode } from "jwt-decode";



//To be Deleted
import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client';
import Cookies from "js-cookie"; // Only available on client
import { protocol, RootApi } from "./config";

export const isServer = () => typeof window === "undefined";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export const decodeUrlID = (urlID: string) => {
    const base64DecodedString = decodeURIComponent(urlID); // Decodes %3D%3D to ==
    const id = Buffer.from(base64DecodedString, 'base64').toString('utf-8'); // Decoding from base64
    return id.split(":")[1]
}


export const checkPermission = (
    token: string | null,
    controls: ("admin" | "teacher" | "student" | "is_staff" | "is_superuser" | "is_hod" | "admin_page" | "lecturer_page" | "accounting_page" | "student_page" | "result_management")[]
) => {
    var user: JwtPayload | null = null
    if (token && token.length) { user = jwtDecode(token) }
    if (!user || !user.is_active) { return false; }
    return controls.every(control => {
        if (control === "admin" && user?.role === "admin") return true;
        if (control === "teacher" && user?.role === "teacher") return true;
        if (control === "student" && user?.role === "student") return true;
        if (control === "is_staff" && user?.is_staff) return true;
        if (control === "is_hod" && user?.is_hod) return true;
        if (control === "is_superuser" && user?.is_hod) return true;

        // Specific page permissions
        if (control === "admin_page" && user?.role === "admin" && user?.dept?.includes("Administration")) return true;
        if (control === "lecturer_page" && (user?.role === "admin" || user?.role === "teacher") && user?.dept?.includes("Lecturer")) return true;
        if (control === "student_page" && (user?.role === "admin" || user?.role === "student") && user?.dept?.includes("Student")) return true;
        if (control === "accounting_page" && user?.role === "admin" && user?.dept?.includes("Accounting")) return true;

        // Result management permission
        if (
            control === "result_management" &&
            (user?.role === "admin" || user?.role === "superadmin") &&
            user?.is_superuser && user?.is_hod
        ) return true;

        return false;
    });
}

export const addOneYear = (year: string) => {
    const [startYear, endYear] = year.split('/').map(Number); // Split and convert to numbers
    const newStartYear = startYear + 1; // Add 1 to the start year
    const newEndYear = endYear + 1; // Add 1 to the end year
    return `${newStartYear}/${newEndYear}`; // Join the new years back into a string
}


export const removeEmptyFields = (obj: Record<string, any>) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => (value !== '' || value != undefined || value != null))
    );
};


export const capitalizeFirstLetter = (str: string) => {
    if (!str) return ''; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


export const getData = async (url: string, searchParams: any, domain: string, page?: string | null) => {

    if (!domain) {
        return null
    }

    const session = await getSession();
    const api = await useAxios(domain);

    if (session.access && session.access.length > 10) {
        var config = {
            headers: {
                Authorization: `Bearer ${session.access}`,
                'X-API-KEY': API_KEY
            }
        }

        if (Object.keys(searchParams).length > 0) {

            var Searchkeys = Object.keys(searchParams)
            if (Searchkeys) {
                var newUrl = `${url}?`
                Searchkeys.forEach(key => {
                    newUrl = `${newUrl}${key}=${searchParams[key]}&`
                });
                try {

                    const response = await api.get(
                        newUrl,
                        config
                    )
                    if (response?.data) {
                        return response.data;
                    }
                    return { error: "error" }
                } catch (error: any) {
                    var errorObj = Object.keys(error)
                    if (errorObj && errorObj.length > 0) {
                        if (errorObj?.includes("code") && error.code == "ERR_BAD_RESPONSE") { console.log("error.code", 104, error.code); return { error: "ERR_BAD_RESPONSE" } }
                        if (errorObj?.includes("code") && error.code == "ECONNRESET") { console.log("error.code", 104, error.code); return { error: "ECONNRESET" } }
                        if (errorObj?.includes("name") && error.name == "Error") { console.log("error.name", 105, error.name,); return { error: "Error" } }
                        if (errorObj?.includes("message") && error.message.includes("Client network")) { console.log("error.message", 106, error.message,); return { error: error.message } }
                        if (errorObj?.includes("cause") && error.cause.code) { console.log("error.cause", 107, error.cause.code); return { error: "ECONNRESET" } }
                        if (errorObj?.includes("response") && error.response.data) {
                            if (error.response?.data?.code == "token_not_valid") { return { unauthorized: error.response.data.code } }
                            return { error: error.response.data }
                        }
                    }

                    if (error.response?.data?.code == "token_not_valid") { return { unauthorized: error.response.data.code } }
                    if (error && Object.keys(error).length > 0)
                        if (error.response?.data.detail) { return { error: error.response.data.detail } }
                    return { error: error }
                    return error;
                }
            }
        }
        if (Object.keys(searchParams).length == 0 && !page) {
            try {
                const response = await api.get(
                    url,
                    config
                )
                // console.log(response, 119)
                return response.data;
            } catch (error: any) {
                if (error.response?.data?.code == "token_not_valid") { return { unauthorized: error.response.data.code } }
                if (error && Object.keys(error).length > 0)
                    if (error.response?.data.detail) { return { error: error.response.data.detail } }
                return error.cause?.code
                return error;
            }
        }
    }
}

export const getDataNotProtected = async (url: string, searchParams: any, domain: string, page?: string | null) => {
    const api = await useAxios(domain);

    if (true) {
        var config = {
            headers: {
                Authorization: ``,
                'X-API-KEY': API_KEY
            }
        }

        if (Object.keys(searchParams).length > 0) {

            var Searchkeys = Object.keys(searchParams)
            if (Searchkeys) {
                var newUrl = `${url}?`
                Searchkeys.forEach(key => {
                    newUrl = `${newUrl}${key}=${searchParams[key]}&`
                });

                try {
                    const response = await axios.get(
                        newUrl,
                        config
                    )
                    if (response?.data) {
                        return response.data;
                    }
                    return { error: "error" }
                } catch (error: any) {
                    var errorObj = Object.keys(error)
                    if (errorObj && errorObj.length > 0) {
                        if (errorObj?.includes("code") && error.code == "ERR_BAD_RESPONSE") { console.log("error.code", 104, error.code); return { error: "ERR_BAD_RESPONSE" } }
                        if (errorObj?.includes("code") && error.code == "ECONNRESET") { console.log("error.code", 104, error.code); return { error: "ECONNRESET" } }
                        if (errorObj?.includes("name") && error.name == "Error") { console.log("error.name", 105, error.name,); return { error: "Error" } }
                        if (errorObj?.includes("message") && error.message.includes("Client network")) { console.log("error.message", 106, error.message,); return { error: error.message } }
                        if (errorObj?.includes("cause") && error.cause.code) { console.log("error.cause", 107, error.cause.code); return { error: "ECONNRESET" } }
                        if (errorObj?.includes("response") && error.response.data) {
                            if (error.response?.data?.code == "token_not_valid") { return { unauthorized: error.response.data.code } }
                            return { error: error.response.data }
                        }
                    }

                    if (error.response?.data?.code == "token_not_valid") { return { unauthorized: error.response.data.code } }
                    if (error && Object.keys(error).length > 0)
                        if (error.response?.data.detail) { return { error: error.response.data.detail } }
                    return { error: error }
                    return error;
                }
            }
        }
        if (Object.keys(searchParams).length == 0 && !page) {
            try {
                const response = await axios.get(
                    url,
                    config
                )
                return response.data;
            } catch (error: any) {
                if (error.response?.data?.code == "token_not_valid") { return { unauthorized: error.response.data.code } }
                if (error && Object.keys(error).length > 0)
                    if (error.response?.data.detail) { return { error: error.response.data.detail } }
                return error.cause?.code
                return error;
            }
        }
    }
}


export const getWeekOfYear: any = (date: any) => {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    var yearStart: any = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return weekNo
}

export const addDaysToDate = (d: Date, days: number) => {
    return new Date(d.getTime() + days * 24 * 60 * 60 * 1000);
}

export const subtractDaysToDate = (d: Date, days: number) => {
    return new Date(d.getTime() + days * 24 * 60 * 60 * 1000);
}


export const getDateOfWeek = (weekNo: number, year: number) => {
    var d = (1 + (weekNo - 1) * 7);
    return new Date(year, 0, d);
}

export const getStartEndOfWeek = (weekNo: any, year: any, option?: string) => {
    var a = (1 + (weekNo - 1) * 7);
    var start = new Date(year, 0, a + 1)
    var end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
    if (option && option == "join") {
        return start.toUTCString().slice(0, 16) + " - " + end.toUTCString().slice(0, 16);
    } else {
        return [start.toUTCString().slice(0, 16), end.toUTCString().slice(0, 16)];
    }
}

export const getWeekRangeOfMonth = (month: any, year: any, option?: string) => {
    if (month && year) {
        const Mondays = getMondays(month, year);
        const weekRange: { weekNo: number, week: string[] | string }[] = Mondays.map((day: string) => {
            if (option && option == "join") {
                return { weekNo: parseInt(year.toString().slice(2, 4) + getWeekOfYear(new Date(day))), week: getStartEndOfWeek(getWeekOfYear(new Date(day), year), year, option) }
            } else {
                return { weekNo: parseInt(year.toString().slice(2, 4) + getWeekOfYear(new Date(day))), week: getStartEndOfWeek(getWeekOfYear(new Date(day), year), year) }
            }
        })
        return weekRange
    }
    return null
    // return weekRange
}

export const getWeekRange = (weekNo: number, year: number) => {
    var a = (2 + (weekNo - 1) * 7);
    var mon = new Date(year, 0, a)
    var tue = new Date(mon.getTime() + 1 * 24 * 60 * 60 * 1000)
    var wed = new Date(tue.getTime() + 1 * 24 * 60 * 60 * 1000)
    var thu = new Date(wed.getTime() + 1 * 24 * 60 * 60 * 1000)
    var fri = new Date(thu.getTime() + 1 * 24 * 60 * 60 * 1000)
    var sat = new Date(fri.getTime() + 1 * 24 * 60 * 60 * 1000)
    var sun = new Date(sat.getTime() + 1 * 24 * 60 * 60 * 1000)

    return [
        mon.toISOString().slice(0, 10),
        tue.toISOString().slice(0, 10),
        wed.toISOString().slice(0, 10),
        thu.toISOString().slice(0, 10),
        fri.toISOString().slice(0, 10),
        sat.toISOString().slice(0, 10),
        sun.toISOString().slice(0, 10),
    ];
}


export const getMondays = (month: number, year: number) => {
    var da = year + "-" + month.toString().padStart(2, "0") + "-01"
    var today = new Date(da)
    var month = today.getMonth();
    var mondays = []
    today.setDate(1);

    while (today.getDay() !== 1) {
        today.setDate(today.getDate() + 1);
    }

    while (today.getMonth() === month) {
        const date = new Date(today)
        const formatted = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + (date.getDay() ? date.getDate() : 7).toString().padStart(2, "0")
        mondays.push(formatted);
        today.setDate(today.getDate() + 7);
    }

    return mondays
}

export const generateGrade = async (mark: any) => {
    if (mark) {
        if (mark > 79.99) { return "A" }
        if (mark > 69.99) { return "B+" }
        if (mark > 59.99) { return "B" }
        if (mark > 54.99) { return "C+" }
        if (mark > 49.99) { return "C" }
        if (mark > 44.99) { return "D+" }
        if (mark > 39.99) { return "D" }
        return "F"
    }
}

export const calcTotalandGrade = (ca: any, ex: any, re: any) => {
    var withResit = false
    var passed = false
    var mark = 0
    var gd = "-"
    if (!re || isNaN(re) || re < 0) {
        mark = (ca ? isNaN(ca) ? 0 : parseInt(ca) : 0) + (ex ? isNaN(ex) ? 0 : parseInt(ex) : 0)
    } else {
        mark = (ca ? isNaN(ca) ? 0 : parseInt(ca) : 0) + (re ? isNaN(re) ? 0 : parseInt(re) : 0)
        withResit = true
    }
    if (mark) {
        if (mark > 0.1) { gd = "F" }
        if (mark > 39.99) { gd = "D" }
        if (mark > 44.99) { gd = "D+" }
        if (mark > 49.99) { gd = "C"; passed = true }
        if (mark > 54.99) { gd = "C+"; passed = true }
        if (mark > 59.99) { gd = "B"; passed = true }
        if (mark > 69.99) { gd = "B+"; passed = true }
        if (mark > 79.99) { gd = "A"; passed = true }

    }
    return { mark: mark, grade: gd, withResit: withResit, passed: passed }
}

export const addingTwoNumbers = async (ca: any, ex: any) => {
    var sum = (ca ? isNaN(ca) ? 0 : parseInt(ca) : 0) + (ex ? isNaN(ex) ? 0 : parseInt(ex) : 0)
    return sum
}

// Function to Extract Number
export const getNumFromStr = (data: string, afterStr: string) => {
    const strAfterSubstr = data.split(afterStr)[1]

    let matches: any = false
    if (strAfterSubstr) {
        matches = strAfterSubstr.match(/(\d+)/)
    }

    if (matches) { return parseInt(matches[0]) }
    else { return 1 }
}


// Function to Get Days Of week Given Day
export const getDatesOfWeekGivenDate = (date: string) => {
    const weekDate = new Date(date);

    function getDate(d: number) {
        const t = new Date(date).setDate(weekDate.getDate() - weekDate.getDay() + d)
        return t
    }

    var monday = getDate(1)
    var tuesday = getDate(2)
    var wednesday = getDate(3)
    var thursday = getDate(4)
    var friday = getDate(5)
    var saturday = getDate(6)
    var sunday = getDate(7)
    const format = (d: any) => {
        let date = new Date(d)
        return (date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0"))
    };
    const dates: any[] = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
    console.log(dates.map((date: any) => format(date)))

    return dates.map((date: any) => format(date))
}



// Function to Calculate Pagination
export const calculatePagination = (total: number, pageCount: number, currentPage: number) => {
    let firstNumber = 1
    let lastNumber = total
    if (currentPage != 1) {
        firstNumber = currentPage * pageCount - pageCount
    }
    if (pageCount < total) {
        lastNumber = currentPage * pageCount
    }
    if (lastNumber > total) {
        lastNumber = total
    }
    return `${firstNumber} - ${lastNumber} of ${total}`
}

13

export const getDistanceBetweenTwoPoints = (latA: number, lonA: number, latB: number, lonB: number) => {
    let p = 0.017453292519943295;    // Math.PI / 180
    let cosi = Math.cos;
    let a = 0.5 - cosi((latA - latB) * p) / 2 + cosi(latB * p) * cosi((latA) * p) * (1 - cosi(((lonA - lonB) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return Math.round(dis * 1000);
}


export const handleResponseError = (error: any, values: string[]) => {
    var e: string = ""
    var erKeys = Object.keys(error);
    values.forEach(val => {
        if (erKeys && !erKeys.includes("id") && erKeys.includes(val)) { e = e + " " + val + "," }
    });
    if (e != "") {
        const alert = () => {
            Swal.fire({
                title: e,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                position: "top-end",
                icon: "warning",
            })
        }
        alert()
    }
    return e
}


interface AxiosRequestProps {
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'update' | 'check'
    url: string
    payload?: DataProps | FormData
    hasAuth?: boolean
    showError?: boolean
    errorObject?: {
        message: string,
        description?: string
    }
    file?: boolean
    params?: any
    token?: any
}

export const axiosRequest = async <T>({
    method = 'get',
    url,
    payload,
    hasAuth = false,
    showError = true,
    file = false,
    params = {},
    errorObject,
    token
}: AxiosRequestProps): Promise<AxiosResponse<T> | null | any> => {

    let headers: any = hasAuth ? {} : {}
    if (file) {
        headers = {
            ...headers,
            'content-type': 'multipart/form-data',
            'X-API-KEY': API_KEY
        }
    }
    else {
        headers = {
            ...headers,
            'content-type': 'application/json',
            'media_type': 'application/json',
            'X-API-KEY': API_KEY
        }
    }
    if (token && Object.keys(token).length > 0) {
        headers = { ...headers, ...token }
    }

    if (params == "remove_payload") {
        payload = payload
        params = {}
    }
    else {
        payload = { payload: payload }
    }

    if (Object.keys(token).length > 0) {
        const response = await Axios({
            method,
            url,
            params: params,
            data: payload,
            headers: { ...token.headers }
        }).catch(
            (e: any) => {
                if (!showError) return
                return e.response
            }
        ) as AxiosResponse<T>
        if (response) { return response }
    } else {
        const response = await Axios({
            method,
            url,
            params: params,
            data: payload,
            headers: { ...headers }
        }).catch(
            (e: any) => {
                logger.log(e, 531)
                if (!showError) return
                return e.response
            }
        ) as AxiosResponse<T>
        if (response) { return response }
    }

    return null
}


export function formatDate(dateString: string) {
    const date = new Date(dateString);

    const day = date.getDate();
    const daySuffix = getDaySuffix(day);
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
    const year = date.getFullYear();

    return `${weekday} ${day}${daySuffix} ${month} ${year}`;
}

function getDaySuffix(day: number) {
    if (day > 3 && day < 21) return "th"; // 4th-20th
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}


export const roundToNearest30 = (time: string): string => {
    let [hour, minute] = time.split(":").map(Number);

    // Round minutes to the nearest 30-minute mark
    if (minute < 15) minute = 0;
    else if (minute < 45) minute = 30;
    else {
        minute = 0;
        hour += 1; // Increment hour when rounding up
    }

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

export const calculateHours = (start: string, end: string): number => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    return (endTotalMinutes - startTotalMinutes) / 60;
};


export const parseJson = (data: string | Record<string, boolean>): Record<string, boolean> => {
    if (typeof data === "string") {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return {};
        }
    }
    return data;
};


export function getAcademicYear(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 = January, 7 = August

    if (month < 7) {
        return `${year - 1}/${year}`;
    } else {
        return `${year}/${year + 1}`;
    }
}


export function getAcademicYearList(): string[] {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 = January, 7 = August
    let thisYearList = [];

    if (month < 7) {
        thisYearList = [ `${year - 2}/${year - 1}`, `${year - 1}/${year}` ];
    } else {
        thisYearList = [ `${year - 1}/${year}` , `${year}/${year + 1}` ];
    }
    return thisYearList
}












// To be deleted
export default function getApolloClient(
  domain: string,
  external?: boolean,
  options?: { csrfToken?: string }
): ApolloClient<NormalizedCacheObject> {

  // Use provided token (from headers/server), or get from cookies (on client only)
  const csrfToken = options?.csrfToken || (!isServer() ? Cookies.get("csrftoken") : "");

  const uri = protocol + (external ? domain : ('api' + domain)) + RootApi + '/graphql/'

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY || "",
    ...(csrfToken && { 'X-CSRFToken': csrfToken }),
    Referer: protocol + (external ? domain : ('api' + domain)) + RootApi,
  };

  return new ApolloClient({
    link: new HttpLink({
      uri,
      fetch,
      headers,
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      mutate: { fetchPolicy: 'no-cache' },
    },
  });
}


export const errorLog = (err: any, show?: boolean) => {
  let mes = "An unknown error occurred";

  if (typeof err === "string") {
    mes = err;
  }

  // GraphQL Errors
  else if (err?.graphQLErrors?.length > 0) {
    console.error("GraphQL Errors:", err.graphQLErrors);
    mes = err.graphQLErrors.map((e: any) => e.message).join('\n');
  }

  // Network Errors (Apollo network error with result.errors[])
  else if (err?.networkError) {
    if ("result" in err.networkError) {
      if (err?.networkError?.result?.errors?.length > 0) {
        console.log("Network Error -> GraphQL errors:", err?.networkError?.result?.errors);
        mes = err.networkError.result.errors.map((e: any) => e.message).join('\n');
      }
      else if (err?.networkError?.message) {
        console.log("Network Error:", err.networkError.message);
        mes = err.networkError.message;
      }
      else {
        console.error("Apollo Network Error:", err.networkError);
      }
    }
  }

  // Extra Info fallback
  else if (err?.extraInfo) {
    console.error("Extra Info:", err.extraInfo);
    mes = String(err.extraInfo);
  }

  // Plain error message
  else if (err?.message) {
    mes = err.message;
  }

  // Unknown error fallback
  else {
    console.error("Unhandled error:", err);
  }

  // SweetAlert show option
  if (show) {
    Swal.fire({
      title: mes,
      icon: 'error',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }

  return mes;
};